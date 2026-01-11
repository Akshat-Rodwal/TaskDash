const Task = require("../models/Task");
const { z } = require("zod");

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Task.countDocuments({ user: req.user.id });
        const tasks = await Task.find({ user: req.user.id })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            tasks,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalTasks: total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const schema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        status: z.enum(["pending", "in_progress", "completed"]).optional(),
    });

    try {
        const { title, description, status } = schema.parse(req.body);

        const task = await Task.create({
            title,
            description,
            status,
            user: req.user.id,
        });

        res.status(201).json(task);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const schema = z.object({
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        status: z.enum(["pending", "in_progress", "completed"]).optional(),
    });

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Make sure the logged in user matches the task user
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const { title, description, status } = schema.parse(req.body);

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status },
            { new: true }
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Make sure the logged in user matches the task user
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        await task.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
