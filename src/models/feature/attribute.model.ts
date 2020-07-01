export interface AttributeModel {
    name: String,
    type: String,
    mandatory: Boolean,
    values: String[],
    regex?: String
}