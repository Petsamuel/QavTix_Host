const fs = require('fs');
const path = require('path');

const hostPath = 'c:/Users/HP/Documents/GitHub/QAVTIX/qavtix_host/src';
const attendeePath = 'c:/Users/HP/Documents/GitHub/QAVTIX/qavtix_attendee/src';

function extractFunction(content, funcName) {
    let braceCount = 0;
    let started = false;
    let startIdx = content.indexOf(\export async function \\);
    if (startIdx === -1) return { funcCode: '', remaining: content };
    
    let endIdx = startIdx;
    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            started = true;
        } else if (content[i] === '}') {
            braceCount--;
        }
        
        if (started && braceCount === 0) {
            endIdx = i + 1;
            break;
        }
    }
    
    return {
        funcCode: content.substring(startIdx, endIdx),
        remaining: content.substring(0, startIdx) + content.substring(endIdx)
    };
}

function processActions(basePath, pairs) {
    for (const { folder, getters } of pairs) {
        const clientPath = path.join(basePath, 'actions', folder, 'client.ts');
        const indexPath = path.join(basePath, 'actions', folder, 'index.ts');
        
        if (!fs.existsSync(clientPath) || !fs.existsSync(indexPath)) continue;
        
        let clientContent = fs.readFileSync(clientPath, 'utf8');
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        let addedToIndex = false;
        
        for (const { oldName, newName } of getters) {
            const { funcCode, remaining } = extractFunction(clientContent, oldName);
            
            if (funcCode) {
                clientContent = remaining;
                let newFuncCode = funcCode.replace(\unction \\, \unction \\);
                
                if (!indexContent.includes('getServerAxios')) {
                    indexContent += \\nimport { getServerAxios } from "@/lib/axios"\n\;
                }
                if (folder === 'payout' && !indexContent.includes('handleApiError')) {
                     // specific for host payout
                     indexContent = \import { handleApiError } from "@/helper-fns/handleApiErrors"\n\ + indexContent;
                }
                
                indexContent += \\n\\n\;
                addedToIndex = true;
            }
        }
        
        if (addedToIndex) {
            fs.writeFileSync(clientPath, clientContent);
            fs.writeFileSync(indexPath, indexContent);
        }
    }
}

// Host actions
processActions(hostPath, [
    { folder: 'checkin', getters: [{ oldName: 'getCheckInMetrics', newName: 'getCheckInMetricsClient' }, { oldName: 'getCheckInAttendees', newName: 'getCheckInAttendeesClient' }] },
    { folder: 'customers', getters: [{ oldName: 'getCustomers', newName: 'getCustomersClient' }, { oldName: 'getCustomerProfile', newName: 'getCustomerProfileClient' }, { oldName: 'getAttendeesExport', newName: 'getAttendeesExportClient' }] },
    { folder: 'dashboard', getters: [{ oldName: 'getDashboardOverview', newName: 'getDashboardOverviewClient' }, { oldName: 'getUpcomingEvents', newName: 'getUpcomingEventsClient' }, { oldName: 'getDashboardFeed', newName: 'getDashboardFeedClient' }] },
    { folder: 'event', getters: [{ oldName: 'getEvents', newName: 'getEventsClient' }, { oldName: 'getEventDetails', newName: 'getEventDetailsClient' }, { oldName: 'getEditEventDetails', newName: 'getEditEventDetailsClient' }, { oldName: 'getAttendeesExport', newName: 'getAttendeesExportClient' }] },
    { folder: 'marketing', getters: [{ oldName: 'getPromoCodes', newName: 'getPromoCodesClient' }, { oldName: 'getAffiliateLinks', newName: 'getAffiliateLinksClient' }, { oldName: 'getEmailCampaigns', newName: 'getEmailCampaignsClient' }] },
    { folder: 'financials', getters: [{ oldName: 'getFinancials', newName: 'getFinancialsClient' }, { oldName: 'getPayoutAccounts', newName: 'getPayoutAccountsClient' }] },
    { folder: 'payout', getters: [{ oldName: 'getPaystackBanks', newName: 'getPaystackBanksClient' }, { oldName: 'verifyAccountNumber', newName: 'verifyAccountNumberClient' }] }
]);

// Attendee actions
processActions(attendeePath, [
    { folder: 'affiliates', getters: [{ oldName: 'getAffiliatePerformanceAll', newName: 'getAffiliatePerformanceAllClient' }, { oldName: 'getWithdrawalHistory', newName: 'getWithdrawalHistoryClient' }] },
    { folder: 'payment', getters: [{ oldName: 'getPaymentAccounts', newName: 'getPaymentAccountsClient' }, { oldName: 'getPaymentMethods', newName: 'getPaymentMethodsClient' }] },
    { folder: 'payout', getters: [{ oldName: 'verifyAccountNumber', newName: 'verifyAccountNumberClient' }] },
    { folder: 'tickets', getters: [{ oldName: 'getTicketReceipt', newName: 'getTicketReceiptClient' }] }
]);

console.log('Action files updated');
