import { Medium } from "./Medium";

class App {
    public static main(): number {
        let medium = Medium.get(2, 7, 50);
        console.log('Hello World');
        return 0;
    }
}

App.main();