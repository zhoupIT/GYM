import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class YI_GymService extends BaseService {
  /**
	 * 健身环境
	 */
  getGymShow() {
    return get("/api/gym/show",
       {loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }

  /**
	 * 会员风采
	 */
  getCustomerShow() {
    return get("/api/customer/show",
      { loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }
}
