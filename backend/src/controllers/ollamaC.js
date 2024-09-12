import axios from 'axios';

const queryOllama=async (prompt)=>{
  try{
    const response =await axios.post(process.env.API_OLLAMA,prompt);
    const summary = response.data.response;
    return summary;
    }catch(error){
    return error
  }
}
const getSummary = async (req, res, next) => {
  const text = req.query.text;

  const prompt={
    model: 'phi3:3.8b',
    prompt: 'dame un remsumen de este texto en menos de 450 caracteres'+text,
    stream: false,
  }
  try {
    const summary=  await queryOllama(prompt);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

const getTags= async (req,res,next)=>{
  try{
    const category =await Category.postCategory(req.body.data);
    res.sendStatus(200);
  }catch(error){
    if(error.code=='ECONNREFUSED')
      res.status(503).json({message:error.message})
    else{
      if(error.code==23505){
        res.status(409).json({message:error.message});
      }
      else
        res.status(500).json({message:error.message});
    } 
    next(error);
  }
} 
;

export { getSummary,getTags };