# Admin Dashboard - Feature Guide

## 🎯 Overview
The enhanced Admin Dashboard now includes **Preview Mode**, **Image Upload**, and **Desmos Graph Integration** for creating rich, interactive math questions.

---

## 🔐 Login Credentials
- **Email:** test@gmail.com
- **Password:** 123

---

## ✨ New Features

### 1. 📝 Preview Mode
**Review questions before saving to database**

**How to use:**
1. Fill in question details (text, options, explanation)
2. Click the **"Preview"** button
3. Review how the question will appear to students
4. Click **"Add Question"** to confirm or **"Cancel"** to edit

**Benefits:**
- Catch typos and formatting errors
- Verify correct answer is properly marked
- See how images and graphs render
- Edit before committing to database

---

### 2. 🖼️ Image Upload
**Add graphs, diagrams, and visual aids to questions**

**How to use:**
1. In the question form, find **"Upload Image (Graph/Diagram)"**
2. Click the file input and select an image (JPG, PNG, GIF, etc.)
3. Preview appears immediately below the input
4. Click **"Remove"** button if you want to change the image
5. Click **"Preview"** to see how it looks in the question

**Supported formats:**
- JPG/JPEG
- PNG
- GIF
- SVG
- WebP

**Technical details:**
- Images are converted to base64 and stored with the question
- No server storage needed (currently)
- Max recommended size: 2MB per image

**Best practices:**
- Use clear, high-contrast images
- Keep file sizes reasonable (< 500KB recommended)
- Ensure graphs have visible labels and axes
- Test on mobile view using browser dev tools

---

### 3. 📊 Desmos Graph Integration
**Interactive mathematical graphs using Desmos API**

**How to use:**
1. In the question form, find **"Graph Expression"**
2. Enter equations naturally - **NO LaTeX needed!** Just type like you would in Desmos
3. **Live preview** shows your graph as you type
4. Use semicolons (`;`) or new lines to separate multiple equations
5. Click **"Preview"** to see how it looks in the full question

**Example expressions (type exactly as shown):**

**Basic functions:**
- `y=x^2` (parabola)
- `y=sin(x)` (sine wave)
- `y=2x+1` (linear)
- `y=1/x` (reciprocal)
- `y=sqrt(x)` (square root)

**Multiple expressions:**
- `y=x^2; y=2x+1` (parabola and line on same graph)
- `y=sin(x); y=cos(x)` (compare trig functions)

**Circles and shapes:**
- `x^2+y^2=25` (circle with radius 5)
- `(x-2)^2+(y-3)^2=16` (circle centered at (2,3))

**Advanced:**
- `y=x^3-3x^2+2` (cubic function)
- `y=(x-2)^2+1` (transformed parabola)
- `y=abs(x)` (absolute value)

**✨ Key Features:**
- **No LaTeX required** - type naturally like `sin(x)` not `\sin(x)`
- **Live preview** - see your graph update as you type
- **Toggle preview** - hide/show to save space while editing
- **Student view** - interactive graphs they can zoom and explore

**Power syntax tips:**
- Powers: `x^2` or `x^3`
- Functions: `sin(x)`, `cos(x)`, `tan(x)`, `sqrt(x)`, `abs(x)`
- Fractions: `1/x` or `(x+1)/(x-2)`
- Parentheses: Use liberally for clarity `(x-2)^2+1`

**Graph controls (for students):**
- Zoom in/out with mouse wheel or pinch
- Pan by dragging
- Hover to see coordinates
- Reset zoom with buttons

---

## 🎨 Question List Badges

Questions in the list now show badges to indicate special features:

- **🖼️ Image** - Question includes an uploaded image
- **📊 Graph** - Question includes a Desmos graph
- **✓ Correct** - Correct answer indicator on options

---

## 📤 CSV Upload (Existing Feature)

**Format:**
```csv
Question, Option1 (correct), Option2, Option3, Option4
What is 2+2?, 4, 3, 5, 6
```

**Steps:**
1. Select target topic from dropdown (or create new)
2. Choose CSV file
3. Questions are automatically added with first option as correct
4. Edit individual questions after import if needed

---

## 🔄 Workflow Example

**Creating a quadratic graphing question:**

1. Click **"Add Question"**
2. Enter question: "Which graph represents y = x² - 4x + 3?"
3. In **Desmos Graph Expression**, enter: `y=x^2-4x+3`
4. Fill in 4 options:
   - Option A: "Parabola opening upward with vertex at (2, -1)"
   - Option B: "Parabola opening downward"
   - Option C: "Straight line"
   - Option D: "Circle"
5. Mark Option A as correct
6. Add explanation: "The quadratic has a positive leading coefficient (1), so it opens upward. Complete the square to find vertex: y = (x-2)² - 1"
7. Click **"Preview"** to see the question with interactive graph
8. Verify everything looks correct
9. Click **"Add Question"** to save

---

## 🎓 Best Practices

### For Images:
- ✅ Use for: diagrams, geometric figures, data tables, annotated graphs
- ✅ Ensure text is readable at mobile sizes
- ✅ Include alt text in question description
- ❌ Avoid: Low resolution, small text, unclear diagrams

### For Desmos Graphs:
- ✅ Use for: function visualization, transformations, intersections
- ✅ Keep expressions simple and relevant to the question
- ✅ Test that graph scale is appropriate
- ❌ Avoid: Overly complex expressions, too many overlapping functions

### For Preview:
- ✅ Always preview before saving
- ✅ Check on different screen sizes (use browser dev tools)
- ✅ Verify correct answer is marked
- ✅ Ensure explanation is clear and helpful

---

## 🐛 Troubleshooting

**Desmos graph not showing:**
- Check that Desmos API is loaded (should see calculator in preview)
- Verify LaTeX syntax is correct
- Try simpler expression first (e.g., `y=x`)

**Image not displaying:**
- Ensure file is a valid image format
- Try a smaller file size
- Check browser console for errors

**Preview not working:**
- Ensure all required fields are filled
- Check that at least one option has text
- Verify question text is not empty

---

## 📚 Additional Resources

- [Desmos API Documentation](https://www.desmos.com/api/v1.11/docs/index.html)
- [LaTeX Math Symbols](https://www.overleaf.com/learn/latex/List_of_Greek_letters_and_math_symbols)
- [LaTeX Math Tutorial](https://en.wikibooks.org/wiki/LaTeX/Mathematics)

---

## 💡 Future Enhancements

Possible additions:
- [ ] Server-side image storage
- [ ] LaTeX equation editor with visual preview
- [ ] Import from other question banks
- [ ] Desmos activity builder integration
- [ ] Question templates library
- [ ] Collaborative editing with version history

---

**Last Updated:** 2025-11-03
