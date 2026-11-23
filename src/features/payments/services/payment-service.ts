const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentRecord {
  id: string;
  booking_id: string;
  payer_id: string;
  payee_id: string;
  amount: string | number;
  platform_fee?: string | number | null;
  net_amount: string | number;
  status: PaymentStatus;
  provider?: string | null;
  provider_payment_id?: string | null;
  paid_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  bookings?: {
    id: string;
    job_id: string;
    status: string;
    agreed_amount: string | number;
    job_requests?: {
      id: string;
      title: string;
    };
  };
  profiles_payments_payer_idToprofiles?: {
    id: string;
    full_name: string;
    avatar_url?: string | null;
    email?: string;
  };
  profiles_payments_payee_idToprofiles?: {
    id: string;
    full_name: string;
    avatar_url?: string | null;
    email?: string;
  };
}

export interface CreatePaymentInput {
  booking_id: string;
  payer_id?: string;
  amount?: number;
  platform_fee?: number;
  provider?: string;
  provider_payment_id?: string;
  status?: PaymentStatus;
}

export async function getMyPayments(userId: string): Promise<{
  data: PaymentRecord[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/payments/me/${encodeURIComponent(userId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch payments') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch payments'),
    };
  }
}

export async function getPaymentsForBooking(bookingId: string): Promise<{
  data: PaymentRecord[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/payments/booking/${encodeURIComponent(bookingId)}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch booking payments') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch booking payments'),
    };
  }
}

export async function getPaymentById(paymentId: string): Promise<{
  data: PaymentRecord | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/payments/${encodeURIComponent(paymentId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch payment') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch payment'),
    };
  }
}

export async function createPayment(payload: CreatePaymentInput): Promise<{
  data: PaymentRecord | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to create payment') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to create payment'),
    };
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus,
  providerPaymentId?: string
): Promise<{
  data: PaymentRecord | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/payments/${encodeURIComponent(paymentId)}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status,
          ...(providerPaymentId !== undefined ? { provider_payment_id: providerPaymentId } : {}),
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to update payment status') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to update payment status'),
    };
  }
}

export async function initializePaystackPayment(
  bookingId: string,
  callbackUrl?: string,
  platformFee?: number
): Promise<{
  data: {
    payment: PaymentRecord;
    authorization_url: string;
    access_code: string;
    reference: string;
  } | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/payments/paystack/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        booking_id: bookingId,
        ...(callbackUrl ? { callback_url: callbackUrl } : {}),
        ...(platformFee !== undefined ? { platform_fee: platformFee } : {}),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        data: null,
        error: new Error(err.message ?? 'Failed to initialize Paystack payment'),
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error:
        err instanceof Error ? err : new Error('Failed to initialize Paystack payment'),
    };
  }
}

export async function verifyPaystackPayment(reference: string): Promise<{
  data: {
    verified: boolean;
    status: string;
    reference: string;
    payment: PaymentRecord | null;
  } | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/payments/paystack/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        data: null,
        error: new Error(err.message ?? 'Failed to verify Paystack payment'),
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to verify Paystack payment'),
    };
  }
}

export interface PaystackBank {
  name: string;
  code: string;
  slug?: string;
}

export async function getPaystackBanks(): Promise<{
  data: PaystackBank[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/payments/paystack/banks`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        data: null,
        error: new Error(err.message ?? 'Failed to fetch banks'),
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch banks'),
    };
  }
}

export async function payoutBookingViaPaystack(
  bookingId: string,
  payload: {
    bank_code: string;
    account_number: string;
    account_name?: string;
  }
): Promise<{
  data: {
    transferred: boolean;
    reference: string;
    transfer_code: string | null;
    amount: number;
    platform_fee: number;
    net_amount: number;
    payment: PaymentRecord;
  } | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/payments/paystack/payout/${encodeURIComponent(bookingId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        data: null,
        error: new Error(err.message ?? 'Failed to process payout'),
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to process payout'),
    };
  }
}

export async function refundBookingViaPaystack(
  bookingId: string,
  reason?: string
): Promise<{
  data: {
    refunded: boolean;
    payment: PaymentRecord;
  } | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/payments/paystack/refund/${encodeURIComponent(bookingId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reason ? { reason } : {}),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        data: null,
        error: new Error(err.message ?? 'Failed to process refund'),
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to process refund'),
    };
  }
}
