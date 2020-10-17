import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class YI_CourseService extends BaseService {
  /**
	 * 获取教练的可教课程列表
	 */
  getCourseList(coachID) {
    return get("/api/coach/bind/course" + coachID
    ).then(this.handleRespond);
  }

  /**
	 * 获取教练的某天下的约课列表
	 */
  getAppointmentList(params) {
    return get("/api/coach/course/list/been/appointment",
      params,
      { loadingMsg: "排课中" }
    ).then(this.handleRespond);
  }

  /**
   *   预约课程
   */
  courseAppointment(params) {
    return post("/api/coach/course/appointment",
      params,
      { loadingMsg: "预约中" }
    ).then(this.handleRespond);
  }

  /**
	 * 取消指定约课
	 */
  cancleCourseAppointment(CourseID) {
    return post("/api/coach/course/appointment/cancel/" + CourseID
      ,{loadingMsg: "取消中" }
    ).then(this.handleRespond);
  }

  /**
   *   我的预约列表
   */
  getMyAppointmentList(params) {
    return get("/api/coach/course/list/my/appointment", 
         params
    ).then(this.handleRespond);
  }
}
