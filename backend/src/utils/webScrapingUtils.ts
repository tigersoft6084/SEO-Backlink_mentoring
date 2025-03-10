export default function delay(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
}