import { DependencyModel } from "./dependency.model";
import { AttributeModel } from "./attribute.model";


export interface FeatureModel {
  id: String,
  name: String,
  type: String,
  dependencyOn: DependencyModel[],
  image: String,
  description: String,
  date: Date,
  attributes?: AttributeModel[],
}
