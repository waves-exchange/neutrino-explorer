export const cache = <T extends () => Promise<any>>(cacheTime: number, method: T): T => {
    let storage: ExtractPromise<ReturnType<T>> | undefined = undefined;
    let activeXHR: ReturnType<T> | undefined = undefined;
    let lastUpdate: number | undefined = undefined;

    const execute = (): ReturnType<T> => {
        if (activeXHR) {
            return activeXHR;
        }
        return Promise.resolve(storage) as ReturnType<T>;
    }

    return (() => {
        if (lastUpdate && Date.now() - lastUpdate < cacheTime) {
            return execute();
        }
        lastUpdate = Date.now();
        storage = undefined;

        activeXHR = method() as ReturnType<T>;

        activeXHR
            .then((data) => {
                storage = data;
            });

        return activeXHR;
    }) as unknown as T;
}

type ExtractPromise<T extends Promise<any>> = T extends Promise<infer R> ? R : never;
