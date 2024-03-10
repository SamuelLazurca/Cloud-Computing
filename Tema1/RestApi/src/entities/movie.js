class Movie {
    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.year = row.year;
        this.director = row.director;
        this.rating = row.rating;
        this.tags = row.tags;
    }
}

module.exports = {Movie}