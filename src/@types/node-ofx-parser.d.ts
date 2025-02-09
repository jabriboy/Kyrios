declare module 'node-ofx-parser' {
    interface OFXData {
        headers: Record<string, string>;
        transactions: Array<{
            type: string;
            date: string;
            amount: number;
            id: string;
            memo: string;
        }>;
        accounts: Array<{
            bankId: string;
            accountId: string;
            balance: number;
        }>;
    }

    export function parse(content: string): OFXData;
}
