import axios from "axios"
import { ChatCompletionResponseMessage } from "openai"

export const getCompletion = async (
  messages: ChatCompletionResponseMessage[]
): Promise<string> => {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY!}`,
      },
    }
  )

  return res.data.choices[0]?.message?.content
}
