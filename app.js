const fs = require('fs')
const TurndownService = require('turndown')

// Create a new TurndownService instance
const turndownService = new TurndownService()

// Specify the directory where the JSON files are located
const directoryPath = '/path/to/directory'

// Read all files in the directory
fs.readdir(directoryPath, function(err, files) {
  if (err) {
    console.error('Error reading directory:', err)
    return
  }

  // Loop through all files in the directory
  files.forEach(function(file) {
    // Check if the file is a JSON file
    if (file.endsWith('.json')) {
      // Read the file contents
      const filePath = `${directoryPath}/${file}`
      fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
          console.error(`Error reading file ${filePath}:`, err)
          return
        }

        // Parse the JSON data
        let jsonData
        try {
          jsonData = JSON.parse(data)
        } catch (err) {
          console.error(`Error parsing JSON data in file ${filePath}:`, err)
          return
        }

        // Convert HTML to markdown
        const markdown = turndownService.turndown(jsonData.html)

        // Update the JSON data with the markdown
        jsonData.markdown = markdown

        // Write the updated JSON data back to the file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), function(err) {
          if (err) {
            console.error(`Error writing file ${filePath}:`, err)
            return
          }

          console.log(`Converted HTML to markdown in file ${filePath}`)
        })
      })
    }
  })
})
