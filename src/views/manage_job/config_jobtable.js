import React from "react";
import {useDelete_jobMutation,useUpdate_status_Mutation} from '../../redux/api/api_job'
import { useDispatch } from "react-redux";

const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
};

export const config_jobtable = ( action_delete, setAction_delete) => {    
  const [deleteJob] = useDelete_jobMutation();
  const [updateStatus] = useUpdate_status_Mutation();

  const columns = [
      {
        header: "Job_ID",
        field: "job_id",
        render: (item) => <strong>{item.job_id}</strong>
      },
      {
        header: "Nhà tuyển dung",
        field: "company_name",
        render: (item) => (<strong>{item.company_name.length > 40 ? item.company_name.slice(0, 40) + "..." : item.company_name}</strong>)
      },
      {
        header: "Tiêu đề",
        field: "title",
        render: (item) => (item.title.length > 40 ? item.title.slice(0, 40) + "..." : item.title)
      },
      {
        header: "Địa điểm",
        field: "work_location_name"
      },
      {
        header: "Mức lương",
        field: "salary",
        render: (item) => (item.salary_max==0 && item.salary_min==0)? "Thương lượng" :
          `${item.salary_min.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} - ${item.salary_max.toLocaleString('vii-VN', { style: 'currency', currency: 'VND' })}`
      },
      {
        header: "Status",
        field: "status_",
        render: (item) => (
          <span className={`badge ${item.status_ === 1 ? "bg-success" : "bg-secondary"}`}>
            {item.status_ === 1 ? "Active" : "InActive"}
          </span>
        )
      },
      {
        header: "Create on",
        field: "date_post",
        render: (item) => formatDate(item.date_expi)},
        {
          header: "Exp on",
          field: "date_expi",
          render: (item) => formatDate(item.date_expi)
        }        
      ];
return {
columns,
actions : [
    {
      label: "Xem",
      color: "info",
      onClick: (item) => alert(`Xem tin tuyển dụng: ${item.title}`)
    },
    {
      label: "Xóa",
      color: "danger",
      onClick: async (item) => {
        try {
          console.log("configjob _ truoc khi xóa tin tuyển dụng: ", item.job_id);
          await deleteJob(item.job_id);
          alert(`Xóa tin tuyển dụng: ${item.title} thành công`);
          console.log("state action_delete: ", action_delete);
          setAction_delete({ isdeleting: true });
          
        }
        catch (error) {
          console.log("Xóa thất bại",error);
        }
      },
    },
    {
      label: (item) => item.status_ === 1 ? "Ẩn tin" : "Hiện tin", // Thay đổi label dựa vào status_
      color: (item) => item.status_ === 1 ? "secondary" : "success", // Thay đổi color tương ứng
      onClick: (item) => alert(`Sửa tin tuyển dụng: ${item.title}`)
    },
  ]
}
};

export const useConfigJobtable = (action_delete, setAction_delete) => {
  return config_jobtable(action_delete, setAction_delete);};