import React, { useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import useProjectsContext from '@hooks/useProjectsContext'

const ProjectList = ({ onSelect = () => null }) => {
  const { projects, selectProject, clearSelectedProject } = useProjectsContext()

  useEffect(() => {
    clearSelectedProject()
  }, [])

  const handleProjectSelect = project => {
    selectProject(project)
    onSelect()
  }

  return (
    <div className='project-list'>
      <Paper className='flex flex-col w-full p-2 px-7 my-2'>
        <h3>Select Project</h3>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#38addf4a' }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Books</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map(row => (
              <TableRow
                key={row.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                }}
                hover={true}
                onClick={() => handleProjectSelect(row)}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.books.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default ProjectList
