// specific mapping for fichier-des-personnes-decedees
export default function(record) {
    record._source.id = record._id
    record._source["PRENOM"] = record._source["PRENOMS"].split(/\s/)[0]
    record._source.DATE_NAISSANCE = record._source.DATE_NAISSANCE.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
    record._source.DATE_DECES = record._source.DATE_DECES.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
    record._source.title = [
        "PRENOM","NOM",
        "DATE_NAISSANCE",
        "COMMUNE_NAISSANCE","PAYS_NAISSANCE"
    ].map((field) => record._source[field]).join(" ")
    return record
}