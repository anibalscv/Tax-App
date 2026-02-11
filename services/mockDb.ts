import { AppState, TaxRecord, User } from '../types';

const STORAGE_KEY = 'taxflow_db_v1';

const INITIAL_DATA: AppState = {
  user: null, // Start logged out
  tax_records: [
    {
      id: "tax-001",
      type: "IVA Mensual",
      period: "Enero 2026",
      amount: 450.00,
      currency: "USD",
      due_date: "2026-02-20",
      status: "pending"
    },
    {
      id: "tax-002",
      type: "Impuesto a la Renta",
      period: "Anual 2025",
      amount: 1200.50,
      currency: "USD",
      due_date: "2026-03-15",
      status: "paid",
      receipt_url: "#"
    },
    {
      id: "tax-003",
      type: "Impuesto Predial",
      period: "2026",
      amount: 85.00,
      currency: "USD",
      due_date: "2026-01-30",
      status: "overdue"
    }
  ]
};

const MOCK_USER: User = {
  id: "u-98765",
  full_name: "Valeria Jiménez",
  tax_id: "", // Initially empty until linked
  email: "valeria.j@example.com",
  linked_accounts: [
    {
      bank: "NeoBank",
      last_four: "4422",
      type: "credit"
    }
  ],
  isAuthenticated: true,
  biometricVerified: false
};

export const db = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    }
  },

  getState: (): AppState => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_DATA;
  },

  setState: (newState: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  },

  login: async (email: string): Promise<User> => {
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const state = db.getState();
    const user = { ...MOCK_USER, email };
    state.user = user;
    db.setState(state);
    return user;
  },

  verifyBiometric: async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const state = db.getState();
    if (state.user) {
      state.user.biometricVerified = true;
      db.setState(state);
    }
    return true;
  },

  linkTaxId: async (taxId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const state = db.getState();
    if (state.user) {
      state.user.tax_id = taxId;
      db.setState(state);
    }
  },

  getTaxRecord: (id: string): TaxRecord | undefined => {
    const state = db.getState();
    return state.tax_records.find(t => t.id === id);
  },

  payTax: async (taxId: string): Promise<TaxRecord> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Payment processing
    const state = db.getState();
    const index = state.tax_records.findIndex(t => t.id === taxId);
    if (index !== -1) {
      state.tax_records[index].status = 'paid';
      state.tax_records[index].receipt_url = `receipt-${Date.now()}.pdf`;
      db.setState(state);
      return state.tax_records[index];
    }
    throw new Error("Tax record not found");
  }
};