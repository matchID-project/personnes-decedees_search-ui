// specific mapping for fichier-des-personnes-decedees
export default function(record) {
    record._source.id = record._id

    return record
}