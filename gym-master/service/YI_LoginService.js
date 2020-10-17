import BaseService from "./BaseService";
import {
  post,
  get
} from "../utils/http";

export default class YI_LoginService extends BaseService {
  /**
   * 登录
   */
  wxLoginWithCode(params) {
    return post("/api/customer/login", params).then(this.handleRespond);
  }

  /**
   * 预约签到
   */
  appointmentSignWithCode(params) {
    return post("/api/coach/course/appointment/sign",
      params, {
        loadingMsg: "签到中"
      }
    ).then(this.handleRespond);
  }

  /**
   * 个人信息
   */
  getMyDetail() {
    return get("/api/customer/my/detail").then(this.handleRespond);
  }
}