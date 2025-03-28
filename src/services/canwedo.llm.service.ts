import axios from "axios";

export class CanwedoLlmService {
    private readonly HEADER = {
        'Content-Type': 'application/json',
    }
    private readonly CANWEDO_LLM_API_URL = 'https://canwedo-llm.vinhomes.co.uk';


    async analyze(data: any) {
        return await axios.post(`${this.CANWEDO_LLM_API_URL}/analyze`, data, { headers: this.HEADER })
    }
}