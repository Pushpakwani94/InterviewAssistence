const fs = require('fs');

function replaceFile(path, replacers) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  replacers.forEach(r => content = content.replace(r[0], r[1]));
  fs.writeFileSync(path, content);
}

replaceFile('server/config/db.ts', [
  [/process\.env\.MONGO_URI/g, "process.env['MONGO_URI']"]
]);

replaceFile('server/controllers/authController.ts', [
  [/if \(user && \(await user\.matchPassword\(password\)\)\) \{([\s\S]*?)\}/g, "if (user && (await user.matchPassword(password))) {\n$1\n    return;\n  }"]
]);

replaceFile('server/controllers/categoryController.ts', [
  [/if \(category\) \{([\s\S]*?)\}/g, "if (category) {\n$1\n    return;\n  }"]
]);

replaceFile('server/controllers/questionController.ts', [
  [/req\.params\.id/g, "req.params['id']"],
  [/if \(question\) \{([\s\S]*?)\}/g, "if (question) {\n$1\n    return;\n  }"]
]);

replaceFile('server/controllers/sessionController.ts', [
  [/req\.params\.id/g, "req.params['id']"]
]);

replaceFile('server/controllers/uploadController.ts', [
  [/if \(category\) \{([\s\S]*?)\}/g, "if (category) {\n$1\n    return;\n  }"]
]);

replaceFile('server/middleware/authMiddleware.ts', [
  [/process\.env\.JWT_SECRET/g, "process.env['JWT_SECRET']"]
]);

replaceFile('server/models/PollingState.ts', [
  [/mongoose\.models\.PollingState/g, "mongoose.models['PollingState']"]
]);

replaceFile('server/utils/generateToken.ts', [
  [/process\.env\.JWT_SECRET/g, "process.env['JWT_SECRET']"]
]);

console.log('Fixed TS errors.');
