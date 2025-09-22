export type ItemDataFrontend = {
    id: number,
    name: string,
    code: string | null,
    class: string | null,
    price_euro: string | null,
    price_cent: string | null,
    category_id: number | null
}

export type ItemDataBackend = {
    id: number,
    name: string,
    code: string | null,
    class: string | null,
    price: number,
    category_id: number | null
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