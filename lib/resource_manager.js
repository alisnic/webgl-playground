export default class ResourceManager {
  constructor (map) {
    this.map = map;
    this.data = {}
  }

  loadAll() {
    var promises = []
    var keys = Object.keys(this.map)
    var promises = keys.map(key => fetch(this.map[key]))

    return Promise.all(promises)
      .then(responses => Promise.all(responses.map(r => r.text())))
      .then(payloads => {
        payloads.forEach((data, index)=> {
          this.data[keys[index]] = data
        })
      })
  }
}