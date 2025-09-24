export type ItemDataFrontend = {
    id: number,
    name: string,
    code: string | null,
    item_class: number | null,
    price_euro: string | null,
    price_cent: string | null,
    category_id: number | null
}

export type ItemDataBackend = {
    id: number,
    name: string,
    code: string | null,
    item_class: number | null,
    price: number,
    category_id: number | null
}

export type ItemClassData = {
    id: number,
    name: string,
    rate: number
}

export type CategoryData = {
    id: number,
    name: string,
    priority: number | null,
    sub_category_from: number | null
}

export type TableData = {
    id: number,
    name: string,
    type: number | null
}