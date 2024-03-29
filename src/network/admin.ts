import axios from "axios";

class AdminApi {
  // 로그인
  async postLogin(password: {}) {
    const response = await axios.post(`/api/admin/login`, password);
    return response.data;
  };

  // 로그아웃
  async getLogout() {
    const response = await axios.get(`/api/admin/logout`);
    return response.data;
  };

  // 이미지 받아오기
  async getImages() {
    const response = await axios.get(`/api/admin/images`);
    return response.data;
  };

  // 배너 수정하기
  async postBanner(banner: FormData) {
    await axios.post(`/api/admin/banner`, banner, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return 'banner';
  };

  // 배너, 회사연혁 삭제하기
  async deleteImage(bannerName: string) {
    const response = await axios.delete(`/api/file/image/${bannerName}`);
    return response.data;
  };

  // 로고 수정하기
  async postLogo(logo: FormData) {
    await axios.post(`/api/admin/image`, logo, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return 'logo';
  };

  // 카다록, 자재 승인서 받아오기
  async getDocument() {
    const response = await axios.get(`/api/admin/catalog-material`);
    return response.data;
  };

  // 카다록, 자재 승인서 수정
  async postDocument(documentForm: FormData) {
    const response = await axios.post(`/api/admin/catalog-material`, documentForm, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  };

  /* 관리자 정보 */

  // footer 정보 받아오기
  async getFooter() {
    const response = await axios.get(`/api/admin/footer`);
    return response.data;
  };

  // 관리자 패널 정보 받아오기
  async getPanelInfo() {
    const response = await axios.get(`/api/admin/panel`);
    return response.data;
  };

  // 관리자 비밀번호 변경
  async putUpdatePassword(updatePassword: { curPassword: string, newPassword: string, newPasswordCheck: string }) {
    const response = await axios.put(`/api/admin/password`, updatePassword);
    return response.data.newPassword
  };

  // 관리자 패널 정보 변경
  async putUpdatePanelInfo(panelData: {}) {
    const response = await axios.put(`/api/admin/panel`, panelData);
    return response.data;
  };

  // 회사 정보 받아오기
  async getCompany() {
    const response = await axios.get(`/api/admin/images`);
    return response.data;
  };

  // 인사말 받아오기
  async getIntroduce() {
    const response = await axios.get(`/api/admin/introduce`);
    return response.data;
  };

  // 인사말 변경
  async putIntroduce(introduce: {}) {
    const response = await axios.put(`/api/admin/introduce`, introduce);
    return response.data;
  };

  // 조직도 변경
  async postOrgChart(orgChart: FormData) {
    const response = await axios.post(`/api/admin/image`, orgChart, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.orgChartImage;
  };

  // 회사 연혁 변경
  async postHistory(history: FormData) {
    const response = await axios.post(`/api/admin/history`, history, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.historyImage;
  };

  // CI 소개 변경
  async postCompanyInfo(company: FormData) {
    const response = await axios.post(`/api/admin/image`, company, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.compInfoImage;
  };
}

export const adminApi = new AdminApi();