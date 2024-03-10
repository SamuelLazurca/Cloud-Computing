class Tag {
    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.movies = row.movies;
    }
}

module.exports = {Tag}