import React from "react";
import "./style.css";
import ProjectBox from "./ProjectBox";
//import TopNavigation from "./TopNavigation";
const UserProject = (props) => {
  // console.log("reached userproject component:", props.projectsData);
  const { projectsData, currentUserId } = props;

  if (!projectsData) {
    return <div>Loading data..</div>;
  }

  //Check if projectsData is indeed an array before calling .map
  const projectsList = Array.isArray(projectsData)
    ? projectsData.map((project) => (
        <ProjectBox
          key={project.id}
          project={project}
          currentUserId={currentUserId}
        />
      ))
    : null;

  return (
    <div>
      {/* <TopNavigation currentUserId={currentUserId} /> */}
      <div className="projectlist">{projectsList}</div>
    </div>
  );
};

export default UserProject;
