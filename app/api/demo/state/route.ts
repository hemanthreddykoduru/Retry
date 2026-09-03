import { NextResponse } from 'next/server';
import { RecoveryCasesRepository } from '@/lib/repositories/recovery-cases';
import { InterventionsRepository } from '@/lib/repositories/interventions';
import { AuditLogRepository } from '@/lib/repositories/audit-log';
import { MetricsRepository } from '@/lib/repositories/metrics';

export async function GET(request: Request) {
  const merchantId = request.headers.get('x-merchant-id') || '00000000-0000-0000-0000-000000000001';
  try {
    const rawCases = await RecoveryCasesRepository.listByMerchant(merchantId);
    
    // Stitch interventions and audit logs to match the demoStore structure for the frontend
    const cases = await Promise.all(rawCases.map(async (c) => {
      const interventions = await InterventionsRepository.listByCase(c.id);
      const audit_logs = await AuditLogRepository.listByCase(c.id);
      
      return {
        ...c,
        interventions,
        audit_logs
      };
    }));

    const dateStr = new Date().toISOString().split('T')[0];
    const dbMetrics = await MetricsRepository.getByMerchant(merchantId, dateStr);

    const metrics = dbMetrics ? {
      failures_detected: dbMetrics.failures_detected,
      cases_opened: dbMetrics.cases_opened,
      cases_recovered: dbMetrics.cases_recovered,
      revenue_at_risk_paise: dbMetrics.amount_at_risk,
      recovered_revenue_paise: dbMetrics.amount_recovered,
      recovery_rate: dbMetrics.amount_at_risk > 0 
        ? Math.round((dbMetrics.amount_recovered / dbMetrics.amount_at_risk) * 100)
        : 0,
      calls_placed: dbMetrics.calls_placed,
      whatsapps_sent: dbMetrics.whatsapps_sent,
      optouts: dbMetrics.optouts,
      contacts_avoided: Math.max(0, dbMetrics.cases_opened - dbMetrics.calls_placed - dbMetrics.whatsapps_sent),
      recovered_revenue_trend: 10,
      recovery_rate_trend: 5,
      cost_per_recovery: 3,
      revenue_at_risk_trend: 2
    } : {
      failures_detected: 0,
      cases_opened: 0,
      cases_recovered: 0,
      revenue_at_risk_paise: 0,
      recovered_revenue_paise: 0,
      recovery_rate: 0,
      calls_placed: 0,
      whatsapps_sent: 0,
      optouts: 0,
      contacts_avoided: 0,
      recovered_revenue_trend: 0,
      recovery_rate_trend: 0,
      cost_per_recovery: 0,
      revenue_at_risk_trend: 0
    };

    return NextResponse.json({
      cases,
      customers: [], // Not actively queried on the frontend directly aside from case.customer
      metrics
    });
  } catch (error) {
    console.error('Error fetching state from DB:', error);
    // Fallback if DB fails
    return NextResponse.json({ error: 'Failed to fetch from DB' }, { status: 500 });
  }
}
