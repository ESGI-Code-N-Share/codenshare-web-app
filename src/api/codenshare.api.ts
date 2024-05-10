import {ProgramApi} from "@/api/programs/program.api";


export class CodeNSareApi {
    program: ProgramApi;
    // auth: AuthApi;
    // user: UserApi;
    // friend: FriendApi;
    // post: PostApi;
    // notification: NotificationApi;
    // faq: FaqApi;

    constructor() {
        this.program = new ProgramApi();
        // this.auth = new AuthApi();
        // this.user = new UserApi();
        // this.friend = new FriendApi();
        // this.post = new PostApi();
        // this.notification = new NotificationApi();
        // this.faq = new FaqApi();
    }
}