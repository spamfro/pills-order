class Services {
  constructor() {
    this.products = new Products();
  }
  async init() {
    const [localDb] = [new LocalDb({ indexedDB: window.indexedDB }).open()];  // start all
    this.localDb = await localDb;
    this.inventory = new Inventory({ localDb: this.localDb });
    this.prescriptions = new Prescriptions();
    // this.prescriptions = new Prescriptions({ localDb: this.localDb });
  }
}

class Products {
  static schema =  ['ID', 'DESCR', 'DPU'];
  async fetch() {
    return fetch('data/products.json')
      .then(response => {
        const { url, status, statusText } = response;
        if (!response.ok) { throw Error(`${url} ${status} (${statusText})`) }
        return response.json();
      });
  }
}

class LocalDb {
  constructor({ indexedDB }) {
    this.indexedDB = indexedDB;
  }
  async open() {
    const upgrade = (db, { oldVersion, newVersion }) => {
      // db.createObjectStore('Prescriptions'); // out-of-line key
      db.createObjectStore('Inventory'); // out-of-line key
    };
    this.db = await new Promise((resolve, reject) => {
      const req = this.indexedDB.open('LocalDb', 1);
      req.onerror = () => { reject(req.error) };
      req.onsuccess = () => { resolve(req.result) };
      req.onupgradeneeded = (event) => { upgrade(req.result, event) };
    });
    return this;
  }
}

class Prescriptions {
  static schema = ['ID', 'PID', 'QTY'];
  async fetch() {
    return fetch('data/prescriptions.json')
      .then(response => {
        const { url, status, statusText } = response;
        if (!response.ok) { throw Error(`${url} ${status} (${statusText})`) }
        return response.json();
      });
  }
}

// class Prescriptions {
//   static schema = ['ID', 'PID', 'QTY'];
//   constructor({ localDb }) {
//     this.localDb = localDb;
//   }
//   async fetch() {
//     return new Promise((resolve, reject) => {
//       const tr = this.localDb.db.transaction(['Prescriptions'], 'readonly');
//       tr.onerror = () => { reject(tr.error) };
//       const store = tr.objectStore('Prescriptions');
//       const req = store.getAll();
//       req.onsuccess = () => { resolve(req.result) };
//     });
//   }
//   async put(values) {
//     return new Promise((resolve, reject) => {
//       const tr = this.localDb.db.transaction(['Prescriptions'], 'readwrite');
//       tr.onerror = () => { reject(tr.error) };
//       tr.oncomplete = () => { resolve() };
//       const store = tr.objectStore('Prescriptions');
//       values.forEach(([ID, PID, QTY]) => { store.put([ID, PID, QTY], [ID, PID]) });
//     });
//   }
// }

class Inventory {
  static schema = ['PID', 'QTY'];
  constructor({ localDb }) {
    this.localDb = localDb;
  }
  async fetch() {
    return new Promise((resolve, reject) => {
      const tr = this.localDb.db.transaction(['Inventory'], 'readonly');
      tr.onerror = () => { reject(tr.error) };
      const store = tr.objectStore('Inventory');
      const req = store.getAll();
      req.onsuccess = () => { resolve(req.result) };
    });
  }
  async put(values) {
    return new Promise((resolve, reject) => {
      const tr = this.localDb.db.transaction(['Inventory'], 'readwrite');
      tr.onerror = () => { reject(tr.error) };
      tr.oncomplete = () => { resolve() };
      const store = tr.objectStore('Inventory');
      values.forEach(([PID, QTY]) => { store.put([PID, QTY], PID) });
    });
  }
  async delete(ids) {
    return new Promise((resolve, reject) => {
      const tr = this.localDb.db.transaction(['Inventory'], 'readwrite');
      tr.onerror = () => { reject(tr.error) };
      tr.oncomplete = () => { resolve() };
      const store = tr.objectStore('Inventory');
      ids.forEach(id => { store.delete(id) });
    });
  }
}
