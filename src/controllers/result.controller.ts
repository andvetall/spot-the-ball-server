import { Controller, 
         RouteHandler, 
         RequestPost, 
         ResponseBase } from "common"
import { injectable } from "inversify"
import { ResultService } from "services/result.service"

@injectable()
export class ResultController implements Controller {
  constructor(
    private resultService: ResultService
  ) {
    this.getAllResults = this.getAllResults.bind(this);
    this.addResult = this.addResult.bind(this);
    this.createCsv = this.createCsv.bind(this);
    this.getOneById = this.getOneById.bind(this);
  }

  async getAllResults(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ){
    const results = await this.resultService.getAllResults()
    return response.send(results)
  }

  async addResult(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {          
    const result = await this.resultService.addResult(request.body);
    return response.send(result);
  }

  async getOneById(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
    const { id } = request.params;      
    const result = await this.resultService.getOneById(id);    
    return response.send(result);
  }

  async createCsv(
    request: RequestPost<any>,
    response: ResponseBase<any>
  ) {
      const { id } = request.params;
      const csv = await this.resultService.createCsv(id);
      let resBody = {
        scvCreated: csv
      }
      return response.send(resBody);
  }

  routes(): RouteHandler[] {
    const handlers: RouteHandler[] = [];
    const prefix = "results";
    handlers.push({
      route: `/${prefix}/getAll`,
      handlers: [<any>this.getAllResults],
      type: "GET"
    });
    handlers.push({
      route: `/${prefix}/addResult`,
      handlers: [<any>this.addResult],
      type: "POST"
    });
    handlers.push({
      route: `/${prefix}/getById/:id`,
      handlers: [<any>this.getOneById],
      type: "GET"
    })
    handlers.push({
      route: `/${prefix}/createCsv/:id`,
      handlers: [<any>this.createCsv],
      type: "GET"
    });
    return handlers;
  }
}