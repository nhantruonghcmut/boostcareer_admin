import React from "react";
import {  useFetchEmployersQuery,
  useDelete_EmployersMutation,
  useUpdate_status_EmployersMutation,
  useSend_messageMutation,
  useReset_PasswordMutation,} from '../../redux/api/api_employers'
import { useDispatch } from "react-redux";
import {Modal_message} from "../../components/Modal_message";
const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
};

export const config_employertable = ( action_delete, setAction_delete) => {    
  const [delete_Employers] = useDelete_EmployersMutation();
  const [update_Employers_status] = useUpdate_status_EmployersMutation();
  const [send_message] = useSend_messageMutation();
  const [reset_Password] = useReset_PasswordMutation();
  const [fetchEmployers] = useFetchEmployersQuery();
  
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
        header: "Employer_ID",
        field: "employer_id",
        render: (item) => <strong>{item.Employer_id}</strong>
      },
      {
        header: "User Name",
        field: "company_name",
        render: (item) => (<strong>{item.company_name.length > 40 ? item.company_name.slice(0, 40) + "..." : item.company_name}</strong>)
      },
      {
        header: "Email",
        field: "email",
        render: (item) => (item.email.length > 40 ? item.email.slice(0, 40) + "..." : item.email)
      },
      {
        header: "Status",
        field: "employer_status",
        render: (item) => (
          <span className={`badge ${item.employer_status === 1 ? "bg-success" : "bg-secondary"}`}>
            {item.employer_status === 1 ? "Active" : "InActive"}
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
          console.log("configEmployer _ truoc khi xóa Employer: ", item.Employer_id);
          await delete_Employers(item.Employer_id);
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
      label: "Gửi tin nhăn",
      color: "primary",
      onClick: (item) => openMessageModal(),
    },
    {
      label: (item) => (item.employer_status===1? "Khóa" : "Mở khóa"),
      color: (item) => item.status_ === 1 ? "dark" : "success",
      onClick: async (item) => {
        try {
          console.log("configEmployer _ truoc khi cập nhật status Employer: ", item.employer_id);
          const status_update = item.employer_status === 1? 0 : 1;
          const result = await update_Employers_status({ 'status_': status_update, 'job_ids': [item.employer_id] });
          if (result.data) {
            const searchResult = await fetchEmployers({
              searchData: searchData,
              paging: paging
            });

            if (searchResult.data) {
              dispatch(setjobs(searchResult.data.Employers));
              dispatch(setPaging({
                totalPages: searchResult.data.totalPages || 1,
                totalItems: searchResult.data.totalItems || 0
              }));
            }
          }
        }
        catch (error) {
          console.log("Xóa thất bại",error);
        }
      },
    },
    {
      label: "Đặt lại mật khẩu",
      color: "info",
      onClick: async (item) => {
        try {
          const result =await reset_Password(item.Employer_id);
          if (result.data) {
              alert(`Reset mật khẩu thành công: ${item.title} thành công`);
              setAction_delete({ isdeleting: true });
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

export const useConfigEmployertable = (action_delete, setAction_delete) => {
  return config_employertable(action_delete, setAction_delete);};