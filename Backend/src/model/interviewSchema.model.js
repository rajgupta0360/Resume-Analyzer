const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer to technical question is required"],
    },
    intention: {
        type: String,
        required: [true, "Intention behind technical question is required"],
    },
}, {
    _id: false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer to technical question is required"],
    },
    intention: {
        type: String,
        required: [true, "Intention behind technical question is required"],
    },
}, {
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill name is required"],
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity of skill gap is required"],
    }
}, {
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
         type: Number,
         required: [true, "Day is required"],
    },
    focus: {
        type: String,
        required: [true, "Focus is required"],
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"],
    }]
})

const interviewSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: true 
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema ],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "Title is required"],
    }

}, {
    timestamps: true
})

const interviewModel = mongoose.model("interviewReport", interviewSchema);

module.exports = interviewModel;