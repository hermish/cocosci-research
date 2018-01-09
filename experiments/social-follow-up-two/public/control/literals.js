var literals = {
	consentPage: null,
	consentFailureMessage: null,
	instructionsOne: null,
	thankYouMessage: null,
	instructionsTwo: null,
	choosePage: ''
};

literals.consentPage = [
	'# Consent to Participate in Research\n',

	'`CPHS# 2013-09-5632`',
	'## Overview\n',

	'This HIT is a psychology experiment being conducted by Rachit Dubey, a graduate student in Professor Tania ' +
	'Lombrozo\'s Concepts and Cognition Lab at the University of California, Berkeley. In order to consent to ' +
	'participate, you MUST meet the following criteria:\n',

	'- 18 years of age or older.',
	'- Fluent speaker of English.',
	'- Have not participated in this experiment before.\n',

	'This study is designed to test hypotheses about the nature of people\'s intuitive theories about the world, how ' +
	'they can be changed, and how they influence judgments and behavior. We also hope to learn about how you ' +
	'conceptually understand the world around you. Our intuitive sense of everyday objects and events in the world ' +
	'play a significant role in our thoughts and behaviors, and we wish to understand the nature of human cognition.',
	'You may be asked to do one or more of the following tasks 1) causal learning tasks (e.g., figuring out what ' +
	'causes what), 2) social tasks (e.g., reasoning about others’ minds and behavior), 3) linguistic tasks (e.g., ' +
	'word associations and learning), 4) imagination tasks (e.g., reasoning about events counter to fact), 5) ' +
	'categorization/association tasks (e.g., grouping objects or stating what comes to mind given a prompt), 6) ' +
	'general cognitive tasks (e.g.,impulse control and searching for hidden objects). You may be asked to make ' +
	'judgments about what you see, answer multiple choice or open-ended questions about your judgments (such as ' +
	'making predictions and providing explanations), observe events, and perform actions yourself (such as grouping ' +
	'objects). Sometimes you might watch a short video clip, look at pictures, or listen to music, and you may be ' +
	'asked to answer questions about how the clip or music made you feel.\n',

	'You may refrain from answering any questions that make you uncomfortable and may withdraw your participation at' +
	' any time even after completing the experiment without penalty. The study takes about 10 minutes to complete,' +
	' for which you will receive $1.25.\n',

	'There are no direct benefits to you as a participant, but this research will help us understand various ' +
	'cognitive processes, which may benefit society in a number of ways, including influencing legal and ' +
	'public policy.\n',

	'We will not be asking for any personally identifying information, and we will handle responses as ' +
	'confidentially as possible. Worker IDs will never be tied to your responses on this survey, and IP ' +
	'addresses will not be collected for studies that ask potentially sensitive questions. However, we cannot ' +
	'guarantee the confidentiality of information transmitted over the Internet. To minimize this risk, data ' +
	'containing anything that might be personally identifiable (e.g. Worker IDs) will be encrypted on transfer ' +
	'and storage and will only be accessible to qualified lab personnel. We will be keeping data collected a part ' +
	'of this experiment indefinitely. This anonymized data (containing neither Worker IDs nor IP addresses) may ' +
	'be shared with the scientific community.\n',

	'## Contact\n',

	'If you have any questions about the study, feel free to contact the study investigator: Rachit Dubey at ' +
	'`rach0012@berkeley.edu`, or the principal investigator: Tania Lombrozo at `lombrozo@berkeley.edu`. If you have ' +
	'concerns about your rights as a participant in this experiment, please contact UC Berkeley\'s Committee for ' +
	'Protection of Human Subjects at `(510) 642-7461` or subjects@berkeley.edu.\n',
	'## Consent\n',

	'By selecting the \'consent\' option below, I acknowledge that I am 18 or older, that I am a fluent speaker of ' +
	'English, that I have not completed this experiment before, that I have read this consent form, and that I ' +
	'agree to take part in the research.'
].join('\n');

literals.consentFailureMessage = [
	'# Thank you!\n',

	'As you do not consent to participate, please close this window and return this HIT on MTurk so that another ' +
	'worker can accept it. If you selected this option by mistake, you can change your response and continue with ' +
	'the experiment.\n'
].join('\n');

literals.instructionsOne = [
	'# Instructions\n',

	'On the following pages, you will see 10 questions that people have asked on a popular online forum. For each ' +
	'question, we will ask you to make a series of judgments. Please press the next button below or the arrow key ' +
	'to proceed.\n'
].join('\n');

literals.thankYouMessage = [
	'# Thank you!\n',

	'The survey is now complete, thank you for your participatation. Here is your unique SECRET key: AJFHBG897. ' +
	'Please copy and paste this code in the box of the HIT page for the payment to process.'
].join('\n');

literals.instructionsTwo = [
	'# Instructions\n',

	'On the next page, you will be asked select questions of the ten you have that presented with. If you could see ' +
	'the explanations experts wrote for five of these questions, which five would they be?\n',

	'Please select exactly *five* questions to see expert answers for, otherwise the page will not let you submit. Please ' + 
	'press the next button below or the arrow key to proceed.\n'
].join('\n')

literals.choosePage = [
	'### Your responses\n',

	'_Please remember to select exactly **five** questions you would like to see expert answers for._'
].join('\n');
