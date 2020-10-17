import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class YI_CoachService extends BaseService {
  /**
	 * 获取教练列表
	 */
  getAllCoach() {
    return get("/api/coach/all"
      // {loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }
}
