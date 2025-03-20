import axios from "axios";


export class YescaleService {
    private readonly YESCALE_API_URL = 'https://api.yescale.io/v1';
    private readonly HEADER = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.YESCALE_API_KEY,
    }

    async createChatCompletions(maxTokens: number, messages: any[], model: string) {
        return await axios.post(`${this.YESCALE_API_URL}/chat/completions`, {
            max_tokens: maxTokens,
            messages,
            model
        }, {
            headers: this.HEADER
        });
    }
}