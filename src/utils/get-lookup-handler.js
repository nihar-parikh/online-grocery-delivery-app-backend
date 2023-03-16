export const getLookUpMethod = ({ from, localField, foreignField, as }) => {
    let lookUpObject = {
        $lookup: {
            from,
            localField,
            foreignField,
            as
        }
    }
    return lookUpObject
}

export const getAggregationArray = (query, joinTableNames) => {
    let lookUpArray = joinTableNames.map((tableName) => {
        return getLookUpMethod({
            from: tableName,
            localField: checkLocalFieldName(tableName),
            foreignField: "_id",
            as: checkLocalFieldName(tableName),
        })
    })
    lookUpArray.unshift({
        $match: query,
    })
    return lookUpArray
}


const checkLocalFieldName = (tableName) => {
    if (tableName === "addresses") {
        return "address"
    }

    if (tableName === "products") {
        return "wishlist"
    }
    return tableName
}