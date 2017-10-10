class DatabaseService {
  constructor(angularFireService, $q) {
    this.angularFireService = angularFireService;
    this.$q = $q;
  }

  addObjectToList(pathRef, object) {
    return this.angularFireService.addObjectToList(object, pathRef);
  }

  push(ref, object) {
    var putting = this.$q.defer();
    this.angularFireService.push(ref, object).then((ref) => {
      const keyRef = ref.key;
      putting.resolve(keyRef);
    }).catch((error) => {
      console.log(error);
      putting.reject(error);
    });
    return putting.promise;
  }

  write(ref, object) {
    var writing = this.$q.defer();
    this.angularFireService.write(ref, object).then(() => {
      writing.resolve();
    }, (error) => {
      writing.reject(error);
    });
    return writing.promise;
  }
  
  updateFirebaseObject(object) {
    var updating = this.$q.defer();
    this.angularFireService.updateObject(object).then(() => {
      updating.resolve();
    }, (error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  get(ref) {
    var getting = this.$q.defer();
    this.angularFireService.get(ref).then((result) => {
      getting.resolve(result);
    }, (error) => {
      getting.reject(error);
    });
    return getting.promise;
  }

  waitForValue(ref) {
    var waitingForValue = this.$q.defer();
    this.angularFireService.waitForValue(ref).then((result) => {
      console.log("dbs result");
      console.log(result);
      waitingForValue.resolve(result);
    }, (error) => {
      console.log("dbs error");
      console.log(error);
      waitingForValue.reject(error);
    });
    return waitingForValue.promise;
  }

}

export default DatabaseService;