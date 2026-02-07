import announcementsData from '../data/announcements.json';
import pairAnalysisData from '../data/pairAnalysis.json';
import partnersData from '../data/partners.json';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

let announcements = JSON.parse(JSON.stringify(announcementsData));
let pairAnalysis = JSON.parse(JSON.stringify(pairAnalysisData));
let partners = JSON.parse(JSON.stringify(partnersData));

// ANNOUNCEMENT ENDPOINTS
export const announcementAPI = {
  getAll: async () => {
    await delay();
    return JSON.parse(JSON.stringify(announcements));
  },

  getActive: async () => {
    await delay();
    return JSON.parse(JSON.stringify(announcements.filter(a => a.is_active)));
  },

  getById: async (id) => {
    await delay();
    const announcement = announcements.find(a => a.announcement_id === id);
    if (!announcement) throw new Error('Announcement not found');
    return JSON.parse(JSON.stringify(announcement));
  },

  create: async (data) => {
    await delay();
    const newAnnouncement = {
      announcement_id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    announcements.push(newAnnouncement);
    return JSON.parse(JSON.stringify(newAnnouncement));
  },

  update: async (id, data) => {
    await delay();
    const index = announcements.findIndex(a => a.announcement_id === id);
    if (index === -1) throw new Error('Announcement not found');

    announcements[index] = {
      ...announcements[index],
      ...data,
      announcement_id: announcements[index].announcement_id,
      created_at: announcements[index].created_at,
      updated_at: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(announcements[index]));
  },

  delete: async (id) => {
    await delay();
    const index = announcements.findIndex(a => a.announcement_id === id);
    if (index === -1) throw new Error('Announcement not found');

    announcements.splice(index, 1);
    return { success: true, message: 'Announcement deleted' };
  },
};

// PAIR ANALYSIS ENDPOINTS
export const pairAnalysisAPI = {
  getAll: async () => {
    await delay();
    return JSON.parse(JSON.stringify(pairAnalysis));
  },

  getByCategory: async (category) => {
    await delay();
    return JSON.parse(JSON.stringify(
      pairAnalysis.filter(a => a.category === category)
    ));
  },

  getActive: async () => {
    await delay();
    return JSON.parse(JSON.stringify(
      pairAnalysis.filter(a => a.status === 'active')
    ));
  },

  getById: async (id) => {
    await delay();
    const analysis = pairAnalysis.find(a => a.analysis_id === id);
    if (!analysis) throw new Error('Analysis not found');
    return JSON.parse(JSON.stringify(analysis));
  },

  create: async (data) => {
    await delay();
    const newAnalysis = {
      analysis_id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    pairAnalysis.push(newAnalysis);
    return JSON.parse(JSON.stringify(newAnalysis));
  },

  update: async (id, data) => {
    await delay();
    const index = pairAnalysis.findIndex(a => a.analysis_id === id);
    if (index === -1) throw new Error('Analysis not found');

    pairAnalysis[index] = {
      ...pairAnalysis[index],
      ...data,
      analysis_id: pairAnalysis[index].analysis_id,
      created_at: pairAnalysis[index].created_at,
      updated_at: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(pairAnalysis[index]));
  },

  delete: async (id) => {
    await delay();
    const index = pairAnalysis.findIndex(a => a.analysis_id === id);
    if (index === -1) throw new Error('Analysis not found');

    pairAnalysis.splice(index, 1);
    return { success: true, message: 'Analysis deleted' };
  },
};

// FOREX AND CRYPTO SYMBOLS
export const symbolsAPI = {
  forexPairs: [
    'XAUUSD', 'XAGUSD', 'USOIL', 'EURUSD'
  ],

  cryptoPairs: [
    'BTC', 'ETH', 'SOL', 'SUI'
  ],

  getForexPairs: async () => {
    await delay(100);
    return [...symbolsAPI.forexPairs];
  },

  getCryptoPairs: async () => {
    await delay(100);
    return [...symbolsAPI.cryptoPairs];
  },
};

// PARTNERS ENDPOINTS
export const partnerAPI = {
  getAll: async () => {
    await delay();
    return JSON.parse(JSON.stringify(partners));
  },

  getById: async (id) => {
    await delay();
    const partner = partners.find(p => p.partner_id === id);
    if (!partner) throw new Error('Partner not found');
    return JSON.parse(JSON.stringify(partner));
  },

  create: async (data) => {
    await delay();
    const newPartner = {
      partner_id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };
    partners.push(newPartner);
    return JSON.parse(JSON.stringify(newPartner));
  },

  update: async (id, data) => {
    await delay();
    const index = partners.findIndex(p => p.partner_id === id);
    if (index === -1) throw new Error('Partner not found');

    partners[index] = {
      ...partners[index],
      ...data,
      partner_id: partners[index].partner_id,
      created_at: partners[index].created_at,
    };
    return JSON.parse(JSON.stringify(partners[index]));
  },

  delete: async (id) => {
    await delay();
    const index = partners.findIndex(p => p.partner_id === id);
    if (index === -1) throw new Error('Partner not found');

    partners.splice(index, 1);
    return { success: true, message: 'Partner deleted' };
  },
};
