import React, {Component} from 'react'

import BaseLayout from 'layouts/Base'
import FilterTasksContainer from 'containers/Telephonist/FilterTasks'
import TasksTable from 'containers/Telephonist/TasksTable'


export default
class FilterTasksLayout extends Component {
  render () {
    return (
      <BaseLayout>
        <FilterTasksContainer />
        <TasksTable />
      </BaseLayout>
    )
  }
}
