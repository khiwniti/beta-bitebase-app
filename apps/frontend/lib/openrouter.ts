// OpenRouter AI API Integration for BiteBase
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
  }>
}

class OpenRouterService {
  private apiKey: string
  private baseUrl = 'https://openrouter.ai/api/v1'

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || ''
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found in environment variables')
    }
  }

  async generateResponse(
    messages: ChatMessage[],
    language: 'en' | 'th' = 'en'
  ): Promise<string> {
    try {
      // System prompt for BiteBase AI Assistant
      const systemPrompt: ChatMessage = {
        role: 'system',
        content: language === 'en' 
          ? `You are BiteBase AI, an expert market research consultant specializing in restaurant and cafe location analysis. You help entrepreneurs make data-driven decisions by analyzing demographics, competition, foot traffic, and market opportunities.

Key capabilities:
- Restaurant market analysis and location scouting
- Demographic analysis and target customer identification
- Competition analysis and market positioning
- Foot traffic patterns and peak hours analysis
- Real estate and rental cost evaluation
- Revenue projections and ROI calculations

Always provide specific, actionable insights. When users mention specific locations like "สีลม" (Silom), provide detailed analysis for that area. Be conversational but professional, and always ask follow-up questions to better understand their needs.

Current context: User is planning a restaurant/cafe and needs location analysis assistance.`
          : `คุณคือ BiteBase AI ที่ปรึกษาวิจัยตลาดผู้เชี่ยวชาญด้านการวิเคราะห์ทำเลร้านอาหารและคาเฟ่ คุณช่วยผู้ประกอบการตัดสินใจอย่างมีข้อมูลโดยการวิเคราะห์ข้อมูลประชากร คู่แข่ง การสัญจรของผู้คน และโอกาสทางการตลาด

ความสามารถหลัก:
- การวิเคราะห์ตลาดร้านอาหารและการหาทำเล
- การวิเคราะห์ข้อมูลประชากรและการระบุกลุ่มลูกค้าเป้าหมาย
- การวิเคราะห์คู่แข่งและการวางตำแหน่งทางการตลาด
- รูปแบบการสัญจรของผู้คนและการวิเคราะห์ช่วงเวลาเร่งด่วน
- การประเมินอสังหาริมทรัพย์และต้นทุนการเช่า
- การคาดการณ์รายได้และการคำนวณผลตอบแทนการลงทุน

ให้ข้อมูลเชิงลึกที่เฉพาะเจาะจงและนำไปปฏิบัติได้เสมอ เมื่อผู้ใช้กล่าวถึงสถานที่เฉพาะเช่น "สีลม" ให้การวิเคราะห์โดยละเอียดสำหรับพื้นที่นั้น มีการสนทนาแต่เป็นมืออาชีพ และถามคำถามติดตามเสมอเพื่อเข้าใจความต้องการของพวกเขาให้ดีขึ้น

บริบทปัจจุบัน: ผู้ใช้กำลังวางแผนร้านอาหาร/คาเฟ่และต้องการความช่วยเหลือในการวิเคราะห์ทำเล`
      }

      const allMessages = [systemPrompt, ...messages]

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://bitebase.ai',
          'X-Title': 'BiteBase AI Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: allMessages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('OpenRouter API error:', response.status, errorData)
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data: OpenRouterResponse = await response.json()
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenRouter API')
      }

      return data.choices[0].message.content
    } catch (error) {
      console.error('Error calling OpenRouter API:', error)
      
      // Fallback response based on language
      if (language === 'th') {
        return 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมสนับสนุนหากปัญหายังคงอยู่'
      } else {
        return 'Sorry, there was an error connecting to the AI system. Please try again or contact support if the issue persists.'
      }
    }
  }

  // Analyze specific location mentioned by user
  async analyzeLocation(
    location: string,
    businessType: string,
    language: 'en' | 'th' = 'en'
  ): Promise<string> {
    const locationPrompt: ChatMessage = {
      role: 'user',
      content: language === 'en'
        ? `Please provide a detailed market analysis for opening a ${businessType} in ${location}. Include demographics, competition, foot traffic, rental costs, and specific recommendations.`
        : `กรุณาให้การวิเคราะห์ตลาดโดยละเอียดสำหรับการเปิด${businessType}ใน${location} รวมถึงข้อมูลประชากร คู่แข่ง การสัญจรของผู้คน ค่าเช่า และคำแนะนำเฉพาะ`
    }

    return this.generateResponse([locationPrompt], language)
  }
}

export const openRouterService = new OpenRouterService()
