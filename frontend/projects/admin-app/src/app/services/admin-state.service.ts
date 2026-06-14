import { Injectable, signal, computed } from '@angular/core';

export interface Question {
  id: number;
  title: string;
  difficulty: string;
  answer: string;
  explanation: string;
  example: string;
  keywords: string[];
  technology?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminStateService {
  sessionCode = signal('JAVA123');
  isManualEntryMode = signal(false);
  isDetailPanelOpen = signal(true);
  isMobileSidebarOpen = signal(false);
  
  // Technologies State
  technologies = signal([
    { name: 'Java', count: 512 },
    { name: 'Selenium', count: 420 },
    { name: 'Playwright', count: 315 },
    { name: 'API Testing', count: 280 },
    { name: 'SQL', count: 210 },
    { name: 'AWS', count: 160 },
    { name: 'Agile Scrum', count: 110 },
    { name: 'Appium', count: 125 },
    { name: 'JavaScript', count: 190 },
    { name: 'TypeScript', count: 140 },
    { name: 'Manual Testing', count: 130 }
  ]);
  activeTechnology = signal(this.technologies()[0]);

  // Categories State
  categories = signal([
    { name: 'Core Java', count: 98 },
    { name: 'OOP Concepts', count: 85 },
    { name: 'Collections', count: 72 },
    { name: 'Exception Handling', count: 45 },
    { name: 'Multithreading', count: 40 },
    { name: 'Java 8 Features', count: 38 },
    { name: 'Streams API', count: 28 },
    { name: 'Design Patterns', count: 30 },
    { name: 'Spring Boot', count: 55 },
    { name: 'Interview Scenarios', count: 26 }
  ]);
  activeCategory = signal(this.categories()[0]);

  // Questions State
  masterQuestionDB: Question[] = [];
  allQuestions = signal<Question[]>([]);

  constructor() {
    this.buildMasterDatabase();
    // Default load Java
    this.allQuestions.set(this.masterQuestionDB.filter(q => q.technology === 'Java'));
  }

  buildMasterDatabase() {
    const db: Question[] = [];
    
    for (const tech of this.technologies()) {
      if (tech.name === 'Java') {
        const javaQs = [
          { id: 1, title: 'What is Java?', difficulty: 'Easy', answer: 'Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.', explanation: 'It is a general-purpose programming language intended to let programmers write once, run anywhere (WORA).', example: 'class HelloWorld { public static void main(String[] args) { System.out.println("Hello"); } }', keywords: ['High-level', 'Object-oriented', 'WORA'], technology: 'Java' },
          { id: 2, title: 'What is JVM?', difficulty: 'Easy', answer: 'JVM (Java Virtual Machine) is an abstract machine that enables your computer to run a Java program.', explanation: 'When you run the Java program, it runs on JVM. JVM is responsible for executing the java program line by line.', example: 'java HelloWorld', keywords: ['Virtual Machine', 'Bytecode', 'Execution'], technology: 'Java' },
          { id: 3, title: 'What is JDK?', difficulty: 'Easy', answer: 'JDK (Java Development Kit) is a software development environment used for developing Java applications and applets.', explanation: 'It physically exists. It contains JRE + development tools.', example: 'javac HelloWorld.java', keywords: ['Development Kit', 'Compiler', 'JRE'], technology: 'Java' },
          { id: 4, title: 'Difference between JDK, JRE and JVM?', difficulty: 'Medium', answer: 'JDK is a development kit. JRE is the runtime environment. JVM executes the bytecode.', explanation: 'JDK contains JRE and tools. JRE contains JVM and libraries. JVM is the execution engine.', example: 'class HelloWorld {\\n    public static void main(String[] args) {\\n        System.out.println("Hello Java");\\n    }\\n}', keywords: ['JDK', 'JRE', 'JVM', 'Java', 'Runtime'], technology: 'Java' },
          { id: 5, title: 'What is OOP?', difficulty: 'Easy', answer: 'Object-Oriented Programming is a paradigm based on the concept of objects, which can contain data and code.', explanation: 'The main principles are Encapsulation, Inheritance, Polymorphism, and Abstraction.', example: 'class Dog { String name; void bark() {} }', keywords: ['Paradigm', 'Objects', 'Classes'], technology: 'Java' },
          { id: 6, title: 'What is Encapsulation?', difficulty: 'Medium', answer: "Hiding internal state and requiring all interaction to be performed through an object's methods.", explanation: 'Protects data integrity.', example: 'private int age; public int getAge() { return age; }', keywords: ['Data Hiding', 'Getters', 'Setters'], technology: 'Java' },
          { id: 7, title: 'What is Inheritance?', difficulty: 'Medium', answer: 'Mechanism where a new class inherits properties and behaviors from an existing class.', explanation: 'Promotes code reusability.', example: 'class Dog extends Animal { }', keywords: ['extends', 'Superclass', 'Subclass'], technology: 'Java' },
          { id: 8, title: 'What is Polymorphism?', difficulty: 'Medium', answer: 'The ability of an object to take on many forms.', explanation: 'Usually occurs when classes are related by inheritance.', example: 'Animal a = new Dog(); a.makeSound();', keywords: ['Overloading', 'Overriding'], technology: 'Java' },
          { id: 9, title: 'What is Abstraction?', difficulty: 'Medium', answer: 'Hiding complex implementation details and showing only the essential features.', explanation: 'Can be achieved using abstract classes and interfaces.', example: 'abstract class Shape { abstract void draw(); }', keywords: ['abstract', 'interface', 'hiding'], technology: 'Java' },
          { id: 10, title: 'What is Constructor in Java?', difficulty: 'Easy', answer: 'A special method used to initialize objects.', explanation: 'It is called when an instance of a class is created.', example: 'class Car { Car() { System.out.println("Created"); } }', keywords: ['Initialization', 'new keyword'], technology: 'Java' }
        ];
        db.push(...javaQs);
      } else if (tech.name === 'Playwright') {
        const playwrightQA: Record<string, string> = {
          "Tell me about your experience with Playwright and JavaScript.": "In my recent projects, Playwright with JavaScript has been my primary automation stack. I've used it for UI automation, API testing, regression testing, smoke testing, and cross-browser validation. What I appreciate most is its reliability and the fact that it reduces the effort required to handle synchronization issues.",
          "Why did you choose JavaScript with Playwright?": "JavaScript works naturally with Playwright and allows us to build automation quickly. Since many modern web applications are developed using JavaScript-based frameworks, it becomes easier to understand application behavior and create maintainable automation solutions.",
          "What is Playwright?": "Playwright is a modern automation framework that we use to automate web applications across multiple browsers. It provides reliable automation capabilities, built-in waiting mechanisms, API testing support, and excellent debugging tools, making it a strong choice for modern test automation projects.",
          "Why do you prefer Playwright over Selenium?": "I've worked with both Selenium and Playwright. While Selenium is widely used and has a strong ecosystem, Playwright offers several modern capabilities out of the box, such as auto-waiting, browser contexts, network interception, API testing, and powerful debugging features. These capabilities help reduce maintenance effort and improve test stability.",
          "How do you structure a Playwright framework in JavaScript?": "I usually organize the framework using the Page Object Model approach. We maintain separate folders for page objects, test scripts, utilities, test data, configuration files, and reports. This keeps the framework clean, reusable, and easy to maintain.",
          "How do you handle synchronization in Playwright?": "One of the biggest advantages of Playwright is that it automatically waits for elements to become ready before interacting with them. This significantly reduces the need for explicit waits and makes tests more stable.",
          "How do you identify elements in Playwright?": "I prefer using stable locators such as test IDs, roles, labels, placeholders, and visible text. My goal is always to create locators that remain reliable even when minor UI changes occur in the application.",
          "How do you handle dynamic elements?": "For dynamic elements, I focus on identifying stable attributes and avoid locators that depend heavily on page structure. I also use Playwright's built-in waiting mechanisms to ensure elements are ready before interactions take place.",
          "How do you perform cross-browser testing?": "Playwright allows us to execute the same test suite across Chromium, Firefox, and WebKit. This helps verify that the application behaves consistently for users regardless of the browser they choose.",
          "How do you perform API testing using Playwright?": "Playwright includes built-in API testing capabilities. I use them to validate response codes, response data, authentication, headers, and business rules. This allows us to test backend functionality without depending on the UI.",
          "How do you handle authentication in Playwright?": "Instead of logging in before every test, we typically save an authenticated session and reuse it across multiple executions. This improves execution speed and reduces unnecessary repetitive actions.",
          "What is Browser Context and how have you used it?": "Browser Context acts as an isolated browser session. It allows us to simulate multiple users without opening separate browser instances. This is especially useful when validating workflows involving different user roles.",
          "What is Storage State?": "Storage State allows us to save cookies and local storage information after authentication. We can then reuse that information in future test executions without performing the login process again.",
          "How do you handle multiple tabs?": "Whenever a new tab opens, I capture it through Playwright's event handling mechanism. Once the new page is available, I switch to it, complete the required validations, and return to the original tab if necessary.",
          "How do you handle frames in Playwright?": "For iframe-based applications, I use Playwright's frame support to locate and interact with elements inside the frame. Once the frame is identified, interactions become straightforward and reliable.",
          "How do you perform file uploads?": "Playwright provides a simple way to upload files by directly assigning a file path to the upload element. This approach is reliable and avoids complications related to operating system dialogs.",
          "How do you handle file downloads?": "When a file download is triggered, I capture the download event, validate file information, save the file to a specific location, and verify the downloaded content if required.",
          "What are Playwright fixtures?": "Fixtures help manage test setup and teardown activities. They make tests cleaner, reduce duplicate code, and provide reusable test resources such as browser pages, authenticated users, or test data.",
          "What are hooks in Playwright?": "Hooks allow us to execute setup and cleanup activities before or after tests. They help ensure consistent test environments and reduce repeated code across test cases.",
          "How do you debug failures in Playwright?": "Whenever a failure occurs, I review logs, screenshots, videos, and traces. The trace viewer is particularly helpful because it allows me to replay the test execution and identify the exact point of failure.",
          "What is Trace Viewer?": "Trace Viewer is one of the most useful debugging tools in Playwright. It records every action performed during execution and allows us to review screenshots, network activity, and execution steps in detail.",
          "How do you handle flaky tests?": "When I encounter flaky tests, I focus on identifying the root cause rather than simply increasing wait times. Most flaky failures are caused by synchronization issues, unstable locators, environmental factors, or inconsistent test data.",
          "How do you perform network mocking?": "Playwright allows us to intercept network requests and responses. We use this feature to simulate backend behavior, validate payloads, and test application functionality even when dependent services are unavailable.",
          "How do you perform visual testing?": "For visual testing, we compare screenshots against approved baseline images. This helps us detect unexpected UI changes and maintain visual consistency across releases.",
          "How do you integrate Playwright with CI/CD?": "Our Playwright framework is integrated into the CI/CD pipeline so tests run automatically after deployments or code changes. This provides quick feedback to developers and helps prevent issues from reaching production.",
          "What reporting tools have you used with Playwright?": "I've worked with HTML reports, Allure reports, and custom reporting solutions. These reports provide execution summaries, screenshots, videos, logs, and trace information for easier analysis.",
          "How do you perform data-driven testing in Playwright?": "I separate test data from automation scripts by storing it in JSON files, external files, or databases. This allows the same test scenario to run with multiple datasets without changing the automation code.",
          "How do you manage test data in Playwright?": "I prefer keeping test data outside the test scripts. This improves maintainability and allows business users or testers to update data without modifying automation logic.",
          "How do you handle environment-specific configurations?": "We maintain separate configuration files for different environments such as development, testing, and production. This allows the same framework to execute against multiple environments with minimal changes.",
          "How do you execute tests in parallel?": "Playwright supports parallel execution through workers. We configure the framework to run multiple tests simultaneously, which significantly reduces execution time and improves feedback speed.",
          "What challenges have you faced while working with Playwright?": "One challenge involved testing a highly dynamic application where content changed based on user permissions. We improved locator strategies, added reusable utilities, and collaborated with developers to introduce stable identifiers. This significantly improved execution stability.",
          "How do you maintain your Playwright framework?": "I focus on reusable components, proper folder structure, centralized configuration management, coding standards, reporting, and regular framework improvements to keep maintenance effort low.",
          "What improvements did Playwright bring to your project?": "After implementing Playwright, we noticed faster execution times, fewer flaky failures, reduced maintenance effort, and improved debugging capabilities. This increased confidence in automation results and improved team productivity.",
          "How do you explain the biggest advantage of Playwright?": "For me, the biggest advantage is reliability. Features such as auto-waiting, browser contexts, network interception, API testing, and trace viewer help reduce maintenance effort and improve automation stability.",
          "How do you explain your overall Playwright expertise?": "My experience includes framework development, test automation, API validation, CI/CD integration, debugging, reporting, and cross-browser testing. I have worked on building scalable automation solutions that support both technical and business requirements while maintaining high reliability and maintainability."
        };
        const pwQs = Object.entries(playwrightQA).map(([q, a], index) => ({
          id: Math.random(),
          title: q,
          difficulty: index % 3 === 0 ? 'Hard' : (index % 2 === 0 ? 'Easy' : 'Medium'),
          answer: a,
          explanation: '',
          example: '',
          keywords: ['Playwright', 'Automation', 'Testing'],
          technology: 'Playwright'
        }));
        db.push(...pwQs);
      } else {
        const genericQs = [
          { id: Math.random(), title: `What is ${tech.name}?`, difficulty: 'Easy', answer: `${tech.name} is a widely-used technology in modern software development.`, explanation: '', example: ``, keywords: [tech.name, 'Basics'], technology: tech.name },
          { id: Math.random(), title: `What are the core features of ${tech.name}?`, difficulty: 'Medium', answer: `The core features include scalability, robustness, and a large ecosystem.`, explanation: '', example: ``, keywords: ['Features', 'Enterprise'], technology: tech.name },
          { id: Math.random(), title: `How do you troubleshoot ${tech.name}?`, difficulty: 'Hard', answer: `Troubleshooting involves checking logs, verifying configurations, and isolating the issue.`, explanation: '', example: ``, keywords: ['Troubleshooting', 'Debugging'], technology: tech.name }
        ];
        db.push(...genericQs);
      }
    }
    this.masterQuestionDB = db;
  }

  searchQuery = signal('');

  filteredQuestions = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      // Global Search: Search across ALL technologies in the master DB
      return this.masterQuestionDB.filter(x => 
        x.title.toLowerCase().includes(q) || 
        x.answer.toLowerCase().includes(q) ||
        x.technology?.toLowerCase().includes(q)
      );
    } else {
      // Local Filter: Return only questions for the active technology
      return this.allQuestions();
    }
  });

  selectedQuestion = signal<Question | null>(null);

  selectTechnology(tech: any) {
    this.activeTechnology.set(tech);
    
    // Mock changing categories based on technology
    this.categories.set([
      { name: tech.name + ' Basics', count: 45 },
      { name: 'Advanced ' + tech.name, count: 30 },
      { name: 'Interview Scenarios', count: 20 }
    ]);
    this.activeCategory.set(this.categories()[0]);

    this.allQuestions.set(this.masterQuestionDB.filter(q => q.technology === tech.name));
    
    this.selectedQuestion.set(null);
  }

  selectCategory(cat: any) {
    this.activeCategory.set(cat);
  }

  selectQuestion(q: Question) {
    this.selectedQuestion.set(q);
    this.isDetailPanelOpen.set(true);
  }

  setSearch(q: string) {
    this.searchQuery.set(q);
  }

  setManualEntryMode(isManual: boolean) {
    this.isManualEntryMode.set(isManual);
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.set(!this.isMobileSidebarOpen());
  }
}
