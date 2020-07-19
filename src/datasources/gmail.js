const { RESTDataSource } = require("apollo-datasource-rest");

class GMailAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://www.googleapis.com/gmail/v1/users";
  }

  willSendRequest(request) {
    request.headers.set("X-App-Token", "P98N4lriCOtOzsXeoKMRdtvWe");
  }

  // leaving this inside the class to make the class easier to test
  // launchReducer(launch) {
  //   return {
  //     id: launch.flight_number || 0,
  //     cursor: `${launch.launch_date_unix}`,
  //     site: launch.launch_site && launch.launch_site.site_name,
  //     mission: {
  //       name: launch.mission_name,
  //       missionPatchSmall: launch.links.mission_patch_small,
  //       missionPatchLarge: launch.links.mission_patch
  //     },
  //     rocket: {
  //       id: launch.rocket.rocket_id,
  //       name: launch.rocket.rocket_name,
  //       type: launch.rocket.rocket_type

  //     }
  //   };
  // }

  // async getCountyByZip({zip}) {
  //   const res = await this.get("launches", { flight_number: launchId });
  //   return this.launchReducer(res[0]);
  //   // return this.get(`?zip_code=${zip}`);
  // }

  async getAllCounties() {
    const response = await this.get("");
    const data = await response;
    return data;
  }

  async getCountyByZip({ zip }) {
    const response = await this.get("", { zip_code: `${zip}` });
    const data = await response;
    return data[0];
  }

  // async getAllLaunches() {
  //   const response = await this.get("launches");

  //   // transform the raw launches to a more friendly
  //   return Array.isArray(response)
  //     ? response.map(launch => this.launchReducer(launch))
  //     : [];
  // }

  // async getLaunchById({ launchId }) {
  //   const res = await this.get("launches", { flight_number: launchId });
  //   return this.launchReducer(res[0]);
  // }

  // async getLaunchesByIds({ launchIds }) {
  //   return Promise.all(
  //     launchIds.map(launchId => this.getLaunchById({ launchId }))
  //   );
  // }
}

module.exports = NYZipAPI;
