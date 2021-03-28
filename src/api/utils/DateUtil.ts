export function CheckTimeLimit(from: Date, to: Date = new Date(), limit: number = 300000): boolean {
    return from.getTime() >= (to.getTime() - limit) && from.getTime() < to.getTime();
}
