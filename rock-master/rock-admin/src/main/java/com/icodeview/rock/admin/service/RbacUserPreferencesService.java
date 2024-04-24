package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacTodoDto;
import com.icodeview.rock.admin.dto.UserPreferencesDto;
import com.icodeview.rock.admin.pojo.RbacUserPreferences;
import com.icodeview.rock.admin.vo.RbacTodoVo;
import com.icodeview.rock.admin.vo.RbacUserPreferencesVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacUserPreferencesService extends IService<RbacUserPreferences> {
    PageResult<RbacUserPreferencesVo> getIndex(Long id, Long userid, Integer noWorkDay, Integer belongto, Integer noMoreThanTime, Long pageNum, Long pageSize);
    void createPreferences(UserPreferencesDto preferencesDto);
    void deletePreferences(Integer id);
    void updatePreferences(UserPreferencesDto preferencesDto);
}
