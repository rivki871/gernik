export interface waitingClient {
    no: number,
    name: string
    address: string,
    phone: string,
    insertDate: Date,
    remarks: string,
    isWaiting: boolean,
    isLoan: boolean,
    loanDate?: Date,
    payment?: number,
    securityCheck?: boolean,
    bagColor: number
}