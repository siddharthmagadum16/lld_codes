

interface Inventory {
    skuId: string;
    quantity: number;
    minThreshold: number;
}

interface ISubscriber {
    notification(message: string): void;
}

interface IPublisher {
    subscribe(sub: ISubscriber): void;
    unscubscribe(sub: ISubscriber): void;
    notify(message: string): void;
}

export {
    Inventory,
    IPublisher,
    ISubscriber,
}