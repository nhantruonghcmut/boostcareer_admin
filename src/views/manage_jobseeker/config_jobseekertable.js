import React from "react";
import { 
  useDelete_jobseekersMutation,
  useUpdate_jobseekersMutation,
  useUpdate_status_jobseekersMutation,
  useSend_message_jobseekerMutation,
  useReset_Password_jobseekerMutation,} from '../../redux/api/api_jobseeker'
import { useDispatch } from "react-redux";
import Modal_message from "../../components/Modal_message";
const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
};

export const config_jobseekertable = ( need_reload, setNeed_reload ) => {    
  const [delete_jobseekers] = useDelete_jobseekersMutation();
  const [update_jobseekers_status] = useUpdate_status_jobseekersMutation();
  const [send_message] = useSend_message_jobseekerMutation();
  const [reset_Password] =   useReset_Password_jobseekerMutation();

  
  const [visible, setVisible] = React.useState(false);
  const openMessageModal = () => {setVisible(true);};
  const handleSendMessage = async (message) =>  {
    try {
      const result = await send_message({'message':message});
      if (result.data) {
        alert("Gửi tin nhắn thành công");
      }
    }
    catch (error) {
      console.error("Send message error:", error);
    }
  };

  const columns = [
      {
        header: "jobseeker_ID",
        field: "jobseeker_id",
        render: (item) => <strong>{item.jobseeker_id}</strong>
      },
      {
        header: "Họ và tên",
        field: "full_name",
        render: (item) => (<strong>{item.company_name.length > 40 ? item.company_name.slice(0, 40) + "..." : item.company_name}</strong>)
      },
      {
        header: "Email",
        field: "email",
        render: (item) => (item.email.length > 40 ? item.email.slice(0, 40) + "..." : item.email)
      },
      {
        header: "Địa chỉ",
        field: "address",
        render: (item) => (item.work_location.length > 40 ? item.work_location.slice(0, 40) + "..." : item.work_location)
      },
      {
        header: "Ngành nghề",
        field: "job_function",
        render: (item) => (item.industry_name)
      },
      {
        header: "Quy mô",
        field: "scale_total",
        render: (item) => (item.scale_total)
      },
      {
        header: "Status",
        field: "jobseeker_status",
        render: (item) => (
          <span className={`badge ${item.jobseeker_status === 1 ? "bg-success" : "bg-secondary"}`}>
            {item.jobseeker_status === 1 ? "Active" : "InActive"}
          </span>
        )
      },       
      ];
return {
columns,
actions : [
    {
      label: "Xem hồ sơ",
      color: "warning",
      onClick: (item) => alert(`Xem tin tuyển dụng: ${item.title}`)
    },
    {
      label: "Xóa",
      color: "danger",
      onClick: async (item) => {
          try {            
            const result =await delete_jobseekers({ jobseeker_ids: [item.jobseeker_id] })
            // Cập nhật state để reload   
            if (result.data) { setNeed_reload(true); }
            alert(`Xóa tài khoản tuyển dụng: ${item.company_name} thành công`);
          }
          catch (error) {
            console.log("Xóa thất bại", error);
          }
      },
    },
    {
      label: "Gửi tin nhăn",
      color: "primary",
      onClick: (item) => openMessageModal(),
    },
    {
      label: (item) => (item.jobseeker_status===1? "Khóa" : "Mở khóa"),
      color: (item) => item.jobseeker_status === 1 ? "dark" : "success",
      onClick: async (item) => {
        try {
          const newStatus = item.jobseeker_status === 1 ? 0 : 1;
          const result = await update_jobseekers_status({ 'status_': newStatus, 'jobseeker_ids': [item.jobseeker_id] });
          if (result.data) {  setNeed_reload(true); }
            }
        catch (error) 
            {  console.log("Cập nhật trạng thái thất bại", error); }
      },
    },
    {
      label: "Đặt lại mật khẩu",
      color: "info",
      onClick: async (item) => {
        try {
          const result =await reset_Password(item.jobseeker_id);
          if (result.data) {
              alert(`Reset mật khẩu cho: ${item.company_name} thành công`);
              setNeed_reload(true); // Cập nhật state để reload
          } 
        }
        catch (error) {
          console.log("Xóa thất bại",error);
        }
      },
    },
  ]
}
};

export const useConfigjobseekertable = (need_reload, setNeed_reload) => {
  return config_jobseekertable(need_reload, setNeed_reload);};