const fs = require('fs');

const quizFolder = './quizzes/';

function cleanString (input) {
  return input.replace(/\s\s+/g, ' ')
              .replace(/\s*\?\s*/g, '?')
              ;
}

fs.readdir(quizFolder, (err, files) => {
  files.forEach(file => {
    
    fs.readFile(quizFolder + file, 'utf8', function(err, fileData) {
      if (file.substr(file.length - 4, 4) !== '.txt') return;

      const lines = fileData.split('\n');

      const title = lines.shift();
      const questions = [];

      lines.shift();

      while (lines.length > 0) {
        let question = cleanString(lines.shift());

        let answers = [
          lines.shift(),
          lines.shift(),
          lines.shift()
        ];

        let correctAnswer = -1;
        answers = answers.map((answer, index) => {
          let newAnswer = answer.replace('[CORRECT]', '');
          if (answer.length !== newAnswer.length) {
            correctAnswer = index + 1;
            return newAnswer;
          }
          return answer;
        });

        answers = answers.map(answer => {
          return cleanString(answer);
        });

        lines.shift();

        question = question.replace(/\d+\.\s+/, '');
        question = question.replace('(chagua moja)', '');
        question = question.replace('(chagua jibu moja sahihi)', '');

        let entry = {
          question: question,
          answers: answers,
          'answer-type': 'multiple-choice',
        };

        if (correctAnswer > -1) {
          entry['correct-answer'] = correctAnswer;
        }

        questions.push(entry);
      }

      const outputFilename = quizFolder + file + '.json';

      const quiz = {
        id: 0,
        title: title,
        color: '#45B39D',
        video: '',
        questions: questions
      };

      fs.writeFile(outputFilename, JSON.stringify(quiz, null, 2), 'utf8', err => {
        console.log('Wrote ' + outputFilename);
      });

    });

  });
});
