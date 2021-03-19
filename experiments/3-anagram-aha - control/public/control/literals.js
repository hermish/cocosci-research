var Set1 = ['DORNO', 'SLEAC', 'PLTAN', 'OSSIA', 'CHRAI']
var Set2 = ['LOALC', 'CLKRE', 'POREK', 'POHEN', 'MEUSO']
var Set3 = ['LOACL', 'CLREK', 'POEKR', 'PHNOE', 'MUOSE']

var shuffled_Set1 = shuffle(Set1)
var shuffled_Set2 = shuffle(Set2)
var shuffled_Set3 = shuffle(Set3)

var literals = {};
literals.consentPage =  '# Consent Form\n\nWe need your consent to proceed.\n\nYou are being invited to take part in a research study. Before you decide to participate in this study, it is important that you understand why the research is being done and what it will involve. Please take the time to read the following information carefully. Please ask the researcher if there is anything that is not clear or if you need more information.\n\n## Purpose of the research:\nThis study is designed to look at how people solve problems. In this task, you will be asked to solve a problem and answer questions related to that problem.\n\n## Study Procedures\nYou will be presented with some information (e.g., a written narrative, hypothetical scenarios, or scientific data) and will then be asked to make one or more judgments about that information, or decisions based upon it. In some cases you will be asked to provide explanations or justifications for your responses, typically in the form of a short paragraph. The task will not involve deception or emotionally disturbing materials - just simple questions about categories, causal relationships, and languages.\n\nThe answers you provide in the task may be used as stimuli for future participants. However, data that would identify you will not be shared with other participants.\n\nYour total expected time commitment for this study is: *4 minutes and you will be paid $0.80 for your participation.*\n\n## Benefits and Risks\nThere are no direct benefits to you as a participant; however, by furthering our understanding of human cognition, this research will benefit society by helping with the development of automated systems that can better solve problems that are computationally challenging, but that people can solve easily with little formal guidance.\n\nRisks associated with participation in this study are minimal. You may feel slight discomfort answering some questions, but you may refrain from answering any questions that make you uncomfortable and may withdraw your participation at any time even after completing the experiment without penalty.\n\n## Confidentiality\nWe will not be asking for any personally identifying information, and we will handle responses as confidentially as possible. Your name, or your Worker IDs will never be tied to your responses on this survey. However, we cannot guarantee the confidentiality of information transmitted over the Internet. To minimize this risk, data containing anything that might be personally identifiable (e.g. Worker IDs) will be encrypted on transfer and storage and will only be accessible to qualified lab personnel. We will be keeping data collected as part of this experiment indefinitely. This anonymized data (containing neither Worker IDs nor IP addresses) may be shared with the scientific community.\n\n## Compensation\nFor your participation, you will receive *$0.60.* If you are on Prolific and for any reason you do not complete the study (e.g. technical difficulties, or a desire to stop), we will only be able to pay you if you send an email through Prolific, or by emailing the researcher, Rachit Dubey, at rdubey@princeton.edu. If you have any questions about the study, feel free to contact Rachit Dubey or the Principal Investigator, Thomas Griffiths, at tomg@princeton.edu.\n\n## Who to contact with questions\n\n1. Principal Investigator:\n\t- Dr. Thomas Griffiths\n\t- Email: tomg@princeton.edu\n\nIf you have questions regarding your rights as a research subject, or if problems arise which you do not feel you can discuss with the Investigator, please contact the Institutional Review Board at:\n\n1. Assistant Director, Research Integrity and Assurance\n\t- Phone: (609) 258-8543\n\t- Email: irb@princeton.edu\n\n---\n\nI understand the information that was presented and that:\n\n- My participation is voluntary, and I may withdraw my consent and discontinue participation in the project at any time. My refusal to participate will not result in any penalty.\n- I do not waive any legal rights or release Princeton University, its agents, or you from liability for negligence.\n\nI hereby give my consent to be the subject of your research.\n';
literals.noConsentPage = '# Thank you!\n\nYou must consent to participate.';
literals.generalInstructionsPage = '# Welcome \n\n Welcome to the Experiment. In this experiment, we will give you **5 anagrams** to solve. \n\n Please click next to continue.';
literals.generalInstructionsPage2 = '# Instructions\n\n An anagram is simply a word or phrase formed by rearranging the letters of another word or phrase. \n\n For example, BOOK is an anagram of OOBK and MOUSE is an anagram of OUMES. Note that to solve each anagram, you have to use ALL the provided letters to construct one word. \n\n **Important:** You will be paid regardless of whether you solve the anagrams or not. **Therefore, we kindly request you to please not use google or other sources to solve the anagrams, doing so will hurt our data collection :(** \n\n Please click next to continue.';
literals.generalInstructionsPage3 = '# Instructions\n\n In this experiment, we will present you with **FIVE** anagrams. \n\n Each anagram will be presented to you for **10 seconds** and you can use that time to figure out the original word. \n\n **Again, we request you to please not use google or other sources to solve the anagrams, doing so will hurt our data collection** \n\n Please click next to continue.';

literals.nextPage = '> Now an anagram will be shown to you. <br><br> Press \'v\' to view the next anagram.'

literals.HardAnagram1 =  '>#' + shuffled_Set1[0] + '\n<br>';

literals.HardAnagram2 =  '>#' + shuffled_Set1[1] + '\n<br>';

literals.HardAnagram3 =  '>#' + shuffled_Set1[2] + '\n<br>';

literals.HardAnagram4 =  '>#' + shuffled_Set1[3] + '\n<br>'; 

literals.TestAnagramHard =  '>#' + shuffled_Set2[0] + '\n<br>';

literals.TestAnagramEasy =  '>#' + shuffled_Set3[0] + '\n<br>';


literals.thankYouPage =  '# Thank You!\n\nThank you for taking part in our experiment! \n\n Here is your secret code -  *7097DDFC*. Please put this in the survey box to process your payment. \n\n*Purpose of our study:* In this study, we hope to understand how and why people experience Aha! moments during problem-solving.';


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



